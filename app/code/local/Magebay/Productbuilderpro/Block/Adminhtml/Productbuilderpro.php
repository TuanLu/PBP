<?php

class Magebay_Productbuilderpro_Block_Adminhtml_Productbuilderpro extends Mage_Adminhtml_Block_Widget_Grid_Container
{
    public function __construct()
    {
		
        $this->_controller = 'adminhtml_productbuilderpro';
        $this->_blockGroup = 'productbuilderpro';
		parent::__construct(); 
    }
}