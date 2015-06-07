<?php
class Magebay_Productbuilderpro_Model_Layer extends Mage_Core_Model_Abstract {
    protected $parentOptions = array();
    protected $optionData = "";
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
    public function getAllLayers() {
        return $this->getCollection();
    }
    public function getLayerByGroupId ($group_id) 
	{
		$layers = $this->getAllLayers();
		$layers->addFieldToFilter('group_id', $group_id);
		return $layers;
	}
    /*Return an array which use in add or edit form. Parent Id-name*/
	public function getParentOptions()
	{
		$layers = $this->getAllLayers();
		$this->parentOptions[0] = array(
            'title'=> "Root", 
            'group_id'=>'', 
            'level' => 0,
            'id' => 0
        );
		foreach ($layers as $layer) {
			if($layer->getParentId() == 0) {
				$layerId = $layer->getId();
				$this->parentOptions[$layerId] = array(
                    'title'=>'----' . $layer->getTitle(),
                    'group_id'=>$layer->getGroupId(),
                    'level' => 1,
                    'id' => $layerId
                );
				$hasChild = $this->getChildLayerCollection($layerId);
				if($hasChild->count())
				{
					$this->layerRecursive($layerId);
				}
			}
		}
        //re-index starting to zero
		return array_values($this->parentOptions);
	}
    public function getChildLayerCollection ($parentId)
    {
    	$chilLayers = $this->getAllLayers()->setOrder("position","asc");
        $chilLayers->addFieldToFilter('parent_id', $parentId);
        return $chilLayers;
    }
    /*Get all parent layer fill to select box*/
	public function layerRecursive ($parentID)
	{
		$childCollection = $this->getChildLayerCollection($parentID);
		foreach($childCollection as $value){
			$layerId = $value->getId();
			//Check this layer has child or not
			$this->optionData = $this->getLayerSpace($layerId);
			$this->parentOptions[$layerId] = array(
                'title' => '----' . $this->optionData['blank_space'] . $value->getTitle(),
                'group_id' => $value->getGroupId(),
                'level' => $this->optionData['level'],
                'id' => $layerId
            );
			$hasChild = $this->getChildLayerCollection($layerId);
			if(count($hasChild)>0)
			{
				$this->layerRecursive($layerId);
			}
		}
	}
    //Get all parent id(like gran->father->son)
	protected function getParentIds($layerId)
	{
		$layer = Mage::getModel('productbuilderpro/layer');
		$p_id = $layer->load($layerId)->getParentId();
		$p_ids=$p_id;
		//Stop this function when it parent is root node
		if($p_id != 0)
		{
			$p_ids=$p_ids . "-" . $this->getParentIds($p_id);
		}
		return $p_ids;
	}
	protected function getLayerSpace($layerId)
	{
		$space = "";
		$parentIds = explode("-", $this->getParentIds($layerId));
		for($i=1; $i<count($parentIds);$i++)
		{
			$space = $space . "----";
		}
		return array(
			'blank_space' 	=> $space,
			'level'			=> count($parentIds)
		);
		
	}
}