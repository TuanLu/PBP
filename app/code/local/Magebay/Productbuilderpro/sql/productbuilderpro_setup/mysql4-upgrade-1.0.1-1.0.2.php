<?php
$installer = $this;
$installer->startSetup();
$installer->run("
	ALTER TABLE {$this->getTable('mst_pbp_layer')} ADD is_required smallint(2) DEFAULT 2;
    ALTER TABLE {$this->getTable('mst_pbp_layer')} ADD select_type smallint(2) DEFAULT 1;
");
$installer->endSetup(); 
