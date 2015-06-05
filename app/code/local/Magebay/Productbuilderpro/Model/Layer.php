<?php
class Magebay_Productbuilderpro_Model_Layer extends Mage_Core_Model_Abstract {
	public function _construct() {
		parent::_construct ();
		$this->_init ( 'productbuilderpro/layer' );
	}
    public function saveLayer($data) {
        if(isset($data['id']) && $data['id'] != 0) {
            $this->setData($data);
        } else {
            // New Mode
            $data['id'] = NULL;
            $this->setData($data);
        }
        $this->save();
        return $this;
    }
}