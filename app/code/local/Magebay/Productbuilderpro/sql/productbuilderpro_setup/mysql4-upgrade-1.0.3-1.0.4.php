<?php
$installer = $this;
$installer->startSetup();
$installer->run("
	ALTER TABLE {$this->getTable('mst_pbp_layer')} ADD zindex int DEFAULT 0;
");
$installer->endSetup(); 
