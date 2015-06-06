<?php
class Magebay_Productbuilderpro_Model_Image extends Mage_Core_Model_Abstract {
	public function _construct() {
		parent::_construct ();
		$this->_init ( 'productbuilderpro/image' );
	}
    public function saveImage($data) {
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