<?php
$installer = $this;
$installer->startSetup();
$installer->run("
	ALTER TABLE {$this->getTable('mst_pbp_layer')} ADD independence TEXT DEFAULT '';
    ALTER TABLE {$this->getTable('mst_pbp_layer')} ADD require_layer TEXT DEFAULT '';
");
$installer->endSetup(); 
