<?php
$installer = $this;
$installer->startSetup();
$installer->run("
CREATE TABLE IF NOT EXISTS {$this->getTable('mst_pbp_group')} (
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
	base_product_id int(11) unsigned NOT NULL,
	title varchar(255) NOT NULL DEFAULT '',
	description text NOT NULL,
	status smallint(6) NOT NULL DEFAULT '1',
	created_time datetime DEFAULT NULL,
	update_time datetime DEFAULT NULL,
	thumbnail_image varchar(500) NOT NULL DEFAULT '',
	base_image varchar(500) NOT NULL DEFAULT '',
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS {$this->getTable('mst_pbp_layer')} (
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
	group_id int(11) unsigned NOT NULL,
	parent_id smallint(6) NOT NULL DEFAULT '0',
	title varchar(255) NOT NULL DEFAULT '',
	price decimal(10, 2) DEFAULT 0,
	description text NOT NULL,
	thumbnail_image varchar(500) NOT NULL DEFAULT '',
	main_image varchar(500) NOT NULL DEFAULT '',
	position smallint(6) NOT NULL DEFAULT '1',
	status smallint(6) NOT NULL DEFAULT '1',
	PRIMARY KEY (id),
	FOREIGN KEY (group_id) REFERENCES {$this->getTable('mst_pbp_group')}(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

");
$installer->endSetup(); 

