<?php
$installer = $this;
$installer->startSetup();
$installer->run("
CREATE TABLE IF NOT EXISTS {$this->getTable('mst_pbp_sample')} (
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
	group_id int(11) unsigned NOT NULL,
	layers text NOT NULL,
	status smallint(6) NOT NULL DEFAULT '1',
	position int(11) NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

");
$installer->endSetup(); 

