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
        $collection = $this->getCollection();
        $collection->setOrder("position", "DESC");
        return $collection;
    }
    public function getLayerByGroupId ($group_id) 
	{
        //Limit level deep = 5
        $layerModel = Mage::getModel( 'productbuilderpro/layer' );
		$layers = $this->getAllLayers();
		$layers->addFieldToFilter('group_id', $group_id);
        $layersItems = $layers->toArray()['items'];
        if(count($layersItems)) {
            $layerList = array();
            for($i = 0; $i < count($layersItems); $i++) {
                if($layersItems[$i]['parent_id'] == 0) {
                    $layerList[$i] = $layersItems[$i];
                    $childs = $this->getChildLayerCollection($layersItems[$i]['id'])->toArray()['items'];
                    if(count($childs)) {
                        for($j = 0; $j < count($childs); $j++) {
                            $layerList[$i]['options'][$j] = $childs[$j];
                            $childs1 = $this->getChildLayerCollection($childs[$j]['id'])->toArray()['items'];
                            if(count($childs1)) {
                                for($k = 0; $k < count($childs1); $k++) {
                                    $layerList[$i]['options'][$j]['options'][$k] = $childs1[$k];
                                    $childs2 = $this->getChildLayerCollection($childs1[$k]['id'])->toArray()['items'];
                                    if(count($childs2)) {
                                        for($x = 0; $x < count($childs2); $x++) {
                                            $layerList[$i]['options'][$j]['options'][$k]['options'][$x] = $childs2[$x];
                                            $childs3 = $this->getChildLayerCollection($childs2[$x]['id'])->toArray()['items'];
                                            if(count($childs3)) {
                                                for($y = 0; $y < count($childs3); $y++) {
                                                    $layerList[$i]['options'][$j]['options'][$k]['options'][$x]['options'][$y] = $childs3[$y];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return $layerList;
        }
	}
    /*Return an array which use in add or edit form. Parent Id-name*/
	public function getParentOptions()
	{
		$layers = $this->getAllLayers();
		$this->parentOptions[0] = array(
            'title'=> "Root", 
            'group_id'=>'', 
            'level' => 0,
            'id' => '0' //Should be a string
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
    	$chilLayers = $this->getAllLayers()->setOrder("position","desc");
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