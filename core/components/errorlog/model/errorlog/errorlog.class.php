<?php

	/**
	 * Error Log
	 *
	 * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
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

	class ErrorLog {
		/**
		 * @acces public.
		 * @var Object.
		 */
		public $modx;
		
		/**
		 * @acces public.
		 * @var Array.
		 */
		public $config = array();
		
		/**
		 * @access public.
		 * @param Object $modx.
		 * @param Array $config.
		 */
		public function __construct(modX &$modx, array $config = array()) {
			$this->modx =& $modx;
		
			$corePath 		= $this->modx->getOption('errorlog.core_path', $config, $this->modx->getOption('core_path').'components/errorlog/');
			$assetsUrl 		= $this->modx->getOption('errorlog.assets_url', $config, $this->modx->getOption('assets_url').'components/errorlog/');
			$assetsPath 	= $this->modx->getOption('errorlog.assets_path', $config, $this->modx->getOption('assets_path').'components/errorlog/');
		
			$this->config = array_merge(array(
				'namespace'				=> $this->modx->getOption('namespace', $config, 'errorlog'),
				'lexicons'				=> 'system_events',
				'base_path'				=> $corePath,
				'core_path' 			=> $corePath,
				'model_path' 			=> $corePath.'model/',
				'processors_path' 		=> $corePath.'processors/',
				'elements_path' 		=> $corePath.'elements/',
				'chunks_path' 			=> $corePath.'elements/chunks/',
				'cronjobs_path' 		=> $corePath.'elements/cronjobs/',
				'plugins_path' 			=> $corePath.'elements/plugins/',
				'snippets_path' 		=> $corePath.'elements/snippets/',
				'templates_path' 		=> $corePath.'templates/',
				'assets_path' 			=> $assetsPath,
				'js_url' 				=> $assetsUrl.'js/',
				'css_url' 				=> $assetsUrl.'css/',
				'assets_url' 			=> $assetsUrl,
				'connector_url'			=> $assetsUrl.'connector.php',
				'version'				=> '1.0.1',
				'branding'				=> (boolean) $this->modx->getOption('socialmedia.branding', null, true),
				'branding_url'			=> 'http://www.oetzie.nl',
				'branding_help_url'		=> 'http://www.werkvanoetzie.nl/extras/errorlog'
			), $config);
		
			$this->modx->addPackage('errorlog', $this->config['model_path']);
			
			if (is_array($this->config['lexicons'])) {
				foreach ($this->config['lexicons'] as $lexicon) {
					$this->modx->lexicon->load($lexicon);
				}
			} else {
				$this->modx->lexicon->load($this->config['lexicons']);
			}
		}
		
		/**
		 * @access public.
		 * @return String.
		 */
		public function getHelpUrl() {
			return $this->config['branding_help_url'].'?v='.$this->config['version'];
		}
	}
	
?>