<?php
class Magebay_Productbuilderpro_Model_Mysql4_Group extends Mage_Core_Model_Mysql4_Abstract
{
    public function _construct()
    {
        $this->_init('productbuilderpro/group', 'id');
    }
}