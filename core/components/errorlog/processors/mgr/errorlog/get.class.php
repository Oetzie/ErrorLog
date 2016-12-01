<?php

	/**
	 * Error Log
	 *
	 * Copyright 2016 by Oene Tjeerd de Bruin <info@oetzie.nl>
	 *
	 * This file is part of Error Log, a real estate property listings component
	 * for MODX Revolution.
	 *
	 * Error Log is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU General Public License as published by the Free Software
	 * Foundation; either version 2 of the License, or (at your option) any later
	 * version.
	 *
	 * Error Log is distributed in the hope that it will be useful, but WITHOUT ANY
	 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License along with
	 * Error Log; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
	 * Suite 330, Boston, MA 02111-1307 USA
	 */

	class ErrorLogGetProcessor extends modProcessor {
		/**
		 * @acces public.
		 * @var Object.
		 */
		public $errorlog;
		
		/**
		 * @acces public.
		 * @return Mixed.
		 */
		public function initialize() {
			$this->errorlog = $this->modx->getService('errorlog', 'ErrorLog', $this->modx->getOption('errorlog.core_path', null, $this->modx->getOption('core_path').'components/errorlog/').'model/errorlog/');

			$this->setDefaultProperties(array(
				'lines'		=> 15,
				'content' 	=> false
			));

			return parent::initialize();
		}
		
		/**
		 * @acces public
		 * @return Mixed.
		 */
		public function process() {
			$errorlog = $this->modx->getOption(xPDO::OPT_CACHE_PATH).'logs/error.log';
			
			$output = array(
				'name'		=> $errorlog,
				'log'		=> '',
				'tooLarge'	=> false,
				'size'		=> 0,
				'empty'		=> true,
				'lines'		=> 0
			);
			
			if (file_exists($errorlog)) {
	            $output['size'] = round(@filesize($errorlog) / 1000 / 1000, 2);
  
	            if ($output['size'] > 1) {
	                $output['tooLarge'] = true;
	                
                    $lines = preg_split('/\\r\\n?|\\n/', @file_get_contents($errorlog));
                    
                    $content = end($lines);
                    
                    for ($i = 1; $i < (int) $this->getProperty('lines'); $i++) {
                        while (false == trim($content)) {
                            $content = prev($lines);
                        }
                        
                        $content = prev($lines)."\n".$content;
                    }
                    
	                $output['log'] 		= $content;
	                $output['lines']	= count($lines);
	            } else {
		            $output['log'] 		= @file_get_contents($errorlog);
		            $output['lines']	= count(preg_split('/\\r\\n?|\\n/', $output['log']));
	            }
	            
	            if (strlen(trim($output['log'])) > 0 || $output['tooLarge']) {
	                $output['empty'] = false;
	            }
	            
	            if (!(bool) $this->getProperty('content')) {
		        	unset($output['log']);   
		        }
	        }
			
			return $this->success('', $output);
		}
		
		/**
		 * @acces public
		 * @return Boolean.
		 */
		public function checkPermissions() {
        	return $this->modx->hasPermission('error_log_view');
    	}
	}
	
	return 'ErrorLogGetProcessor';
	
?>