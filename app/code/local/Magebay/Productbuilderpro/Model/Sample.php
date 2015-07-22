<?php
class Magebay_Productbuilderpro_Model_Sample extends Mage_Core_Model_Abstract {
	public function _construct() {
		parent::_construct ();
		$this->_init ( 'productbuilderpro/sample' );
	}
    public function saveSample($data) {
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
    public function getSampleByGroupId($groupId) {
        $collection = $this->getCollection();
        $collection->addFieldToFilter("group_id", $groupId);
        $collection->setOrder("id", "DESC");
        $samples = array();
        if($collection->count()) {
            $itemData = $collection->getFirstItem()->getData();
            $itemData['layers'] = json_decode($itemData['layers'], true);
            $samples[0] = $itemData;
        }
        return $samples;
    }
}