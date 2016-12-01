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
	 
	require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
	require_once dirname(dirname(dirname(dirname(__FILE__)))).'/core/config/config.inc.php';
	require_once dirname(dirname(dirname(dirname(__FILE__)))).'/connectors/index.php';
	
	$instance = $modx->getService('errorlog', 'ErrorLog', $modx->getOption('errorlog.core_path', null, $modx->getOption('core_path').'components/errorlog/').'model/errorlog/');

	if ($instance instanceOf ErrorLog) {
		$modx->request->handleRequest(array(
			'processors_path' 	=> $instance->config['processors_path'],
			'location' 			=> ''
		));
	}

?>