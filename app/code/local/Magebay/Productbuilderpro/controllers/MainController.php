<?php
class Magebay_Productbuilderpro_MainController extends Mage_Core_Controller_Front_Action
{
    public function saveGroupAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not save group. Something went worng!'
        );
        try {
            $postData = file_get_contents("php://input");
            $groupData = json_decode($postData, true);
            $groupModel = Mage::getModel("productbuilderpro/group");
            $result = $groupModel->saveGroup($groupData);
            if($result) {
                $response = array(
                    'status' => 'success',
                    'message' => 'Group saved successfully!',
                    'data' => $result->getData()
                );
                //$this->getResponse()->setBody(json_encode($response));
                $this->_forward("getgroup");
                return;
            }
        } catch(Exception $e) {
        
        }
        echo json_encode($response);
    }
    public function getGroupAction() {
        $groups = $this->getGroups();
        if(count($groups)) {
            echo json_encode($groups);
        }
    }
    protected function getGroups() {
        $groupCollection = Mage::getModel("productbuilderpro/group")->getCollection();
        $layerModel = Mage::getModel("productbuilderpro/layer");
        $sampleModel = Mage::getModel("productbuilderpro/sample");
        $groups = [];
        if($groupCollection->count()) {
            foreach($groupCollection as $group) {
                $groupData = $group->getData();
                $groupData['layers'] = $layerModel->getLayerByGroupId($group->getId());
                $groupData['sample'] = $sampleModel->getSampleByGroupId($group->getId());
                $groups[] = $groupData;
            }
        }
        return $groups;
    }
    public function getLibraryImagesAction() {
        //Use param to make filter later
        $params = $this->getRequest()->getParams();
        $images = $this->getLibraryImages($params);
        echo json_encode($images);
    }
    protected function getLibraryImages($params) {
        $images = Mage::getModel("productbuilderpro/image")->getCollection();
        $libraryImages = array();
        if($images->count()) {
            $libraryImages = $images->toArray()['items'];
        }
        return $libraryImages;
    }
    public function getGroupByIdAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not get customize product data. Something went worng!'
        );
        $groupId = $this->getRequest()->getParam("id");
        $groupCollection = Mage::getModel("productbuilderpro/group")->getCollection();
        $groupCollection->addFieldToFilter("id", $groupId);
        $layerModel = Mage::getModel("productbuilderpro/layer");
        $sampleModel = Mage::getModel("productbuilderpro/sample");
        if($groupCollection->count()) {
            $groupData = $groupCollection->getFirstItem()->getData();
            $groupData['layers'] = $layerModel->getLayerByGroupId($groupId);
            $groupData['sample'] = $sampleModel->getSampleByGroupId($groupId);
            $response = array(
                'status' => 'success',
                'message' => 'Get customize product data successfully!',
                'group_data' => $groupData
            );
        }
        echo json_encode($response);
    }
    public function removeGroupAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not remove this group. Something went worng!'
        );
        $postData = file_get_contents("php://input");
        $groupData = json_decode($postData, true);
        if(isset($groupData['id']) && $groupData['id']) {
            $groupModel = Mage::getModel("productbuilderpro/group");
            $groupModel->load($groupData['id'])->delete();
            $this->_forward("getgroup");
            return false;
        }
        echo json_encode($response);
    }
    public function removeLayerAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not remove this layer. Something went worng!'
        );
        $postData = file_get_contents("php://input");
        $layerData = json_decode($postData, true);
        if(isset($layerData['id']) && $layerData['id']) {
            $layerModel = Mage::getModel("productbuilderpro/layer");
            $layerModel->load($layerData['id'])->delete();
            $this->_forward("getgroup");
            return false;
        }
        echo json_encode($response);
    }
    public function uploadImageAction() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES["file"])) {
            try {
                $upload = $_FILES["file"];
                if (isset($upload['name']) && $upload['name']) {
                    $baseDir = Mage::getBaseDir('media') . DS . "pbp" . DS . "images" .  DS;
                    if (!file_exists($baseDir)) {
                        mkdir($baseDir, 0777);
                    }
                    if (file_exists($baseDir)) {
                        $mediaUrl = Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_MEDIA) . "pbp/images/";
                        $uploadedImages = array();
                        if ($upload['error'] === UPLOAD_ERR_OK) {
                            $filenameTemp = explode(".", $upload["name"]);
                            $originalName = $upload["name"];
                            $name = time() . '-image.' . end($filenameTemp);
                            $size = $upload["size"];
                            $type = $upload["type"]; // could be bogus!!! Users and browsers lie!!!
                            $tmp  = $upload["tmp_name"];
                            $result = move_uploaded_file( $tmp, $baseDir .$name);
                            if ($result) {
                                //Save image to database
                                $imageModel = Mage::getModel("productbuilderpro/image");
                                $imageData = array(
                                    'filename' => $name,
                                    'name' => $originalName,
                                    'category' => 0,
                                    'position' => 0
                                );
                                $imageModel->saveImage($imageData);
                                $response = array(
                                    'status' => 'success',
                                    'message' => 'Image had uploaded successfully!',
                                    'filename' => $name
                                );
                            }
                        } else if ($upload['error'] === UPLOAD_ERR_INI_SIZE) {
                            $response['status'] = 'error';
                            $response['message'] = 'The uploaded file exceeds the upload_max_filesize. Please check your server PHP settings!';
                            $this->getResponse()->setBody(json_encode($response))->sendResponse();
                            exit();
                        }
                    }
                }
            } catch(Exception $e) {
                $response = array(
                    'status' => 'error',
                    'message' => 'Can not upload image. Something went wrong!'
                );
            }
            $this->getResponse()->setBody(json_encode($response));
		}
    }
    public function getLayersAction() {
        $parentOptions = Mage::getModel("productbuilderpro/layer")->getParentOptions();
        $response = array(
            'groups' => $this->getGroups(),
            'parents' => $parentOptions
        );
        echo json_encode($response);
    }
    public function saveLayerAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not save layer. Something went worng!'
        );
        try {
            $postData = file_get_contents("php://input");
            $layerData = json_decode($postData, true);
            //Convert array to string
            $layerData['independence'] = join(",", $layerData['independence']);
            $layerModel = Mage::getModel("productbuilderpro/layer");
            $result = $layerModel->saveLayer($layerData);
            if($result) {
                $response = array(
                    'status' => 'success',
                    'message' => 'layer saved successfully!',
                    'data' => $result->getData()
                );
                //$this->getResponse()->setBody(json_encode($response));
                $this->_forward("getlayers");
                return;
            } 
        } catch(Exception $error) {
              
        }
        echo json_encode($response);
    }
    //Get parent id options
    public function getLayerParentsAction() {
        $options = Mage::getModel("productbuilderpro/layer")->getParentOptions();
        echo json_encode($options);
    }
    protected function sortByIndex($a, $b) {
        return $a['index'] - $b['index'];
    }
    
    public function createThumbnailAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can create thumbnail. Something went worng!'
        );
        $postData = file_get_contents("php://input");
        $selectedLayer = json_decode($postData, true);
        $layerImages = array();
        foreach ($selectedLayer as $layer) {
            if(isset($layer['main_image']) && $layer['main_image'] != "") {
                $layerImages[] = array(
                    'index' => $layer['root_zindex'],
                    'main_image' => $layer['main_image']
                );
            }
        }
        usort($layerImages, array($this, "sortByIndex"));
        $thumbnail = Mage::helper("productbuilderpro")->createThumbnail($layerImages);
        if($thumbnail) {
            $response = array(
                'status' => 'success',
                'message' => 'Thumbnail had been created successfully!',
                'file_path' => $thumbnail 
            );
        }
        echo json_encode($response);
    }
    public function addToCartAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not add product to cart!'
        );
        $postData = file_get_contents("php://input");
        $cartRequest = json_decode($postData, true);
        try {
            // Add Product To Cart
            $productId = $cartRequest['base_product_id'];
            $product = Mage::getModel("catalog/product")->load($productId);
            $cart = Mage::getModel('checkout/cart');
            $cart->init();
            $params = array(
                'product' => $productId,
                'qty' => 1,
                'options' => array(

                )
            );
            // ---- AdditionalOption ---- //
            $additionalOptions = array();
            if ($additionalOption = $product->getCustomOption('additional_options')) {
                $additionalOptions = (array) unserialize($additionalOption->getValue());
            }
            $additionalOptions[] = array(
                'code' => 'pbpinfo',
                'label' => '',
                'value' => '',
                'json' => $postData,
                'time' => microtime()
            );
            // add the additional options array with the option code additional_options
            $product->addCustomOption('additional_options', serialize($additionalOptions));
            // ---- END AdditionalOption ---- //
            $cart->addProduct($product, $params);
            $cart->save();
            Mage::getSingleton('checkout/session')->setCartWasUpdated(true);
            $response = array(
                'status' => 'success',
                'message' => 'Product added to cart successfully!'
            );
        } catch(Exception $error) {
            $response = array(
				'status' => 'error',
				'message' => 'Can not add product to cart! Something went wrong when try to add product. Check "Exception"'
			);
        }
        echo json_encode($response);
    }
    public function saveSampleDesignAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not save sample design. Something went worng!'
        );
        $postData = file_get_contents("php://input");
        if($postData) {
            $postDataDecode = json_decode($postData, true); 
            $groupId = 0;
            foreach($postDataDecode as $layer) {
                $groupId = $layer['group_id'];
                break;
            }
            $sampleModel = Mage::getModel("productbuilderpro/sample");
            $sampleData = array(
                'group_id' => $groupId,
                'layers' => $postData
            );
            $result = $sampleModel->saveSample($sampleData);
            $response = array(
                'status' => 'success',
                'message' => 'Sample design have been successfully saved!'
            );
            $sampleData = $result->getData();
            $sampleData['layers'] = json_decode($sampleData['layers'], true);
            $response['group_id'] = $groupId;
            $response['sample_data'] = array($sampleData); 
        }
        echo json_encode($response);
    }
}