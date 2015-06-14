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
        $groups = [];
        if($groupCollection->count()) {
            foreach($groupCollection as $group) {
                $groupData = $group->getData();
                $groupData['layers'] = $layerModel->getLayerByGroupId($group->getId());
                $groups[] = $groupData;
            }
        }
        return $groups;
    }
    public function removeGroupAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not remove group. Something went worng!'
        );
        $postData = file_get_contents("php://input");
        $groupData = json_decode($postData, true);
        if(isset($groupData['id']) && $groupData['id']) {
            $groupModel = Mage::getModel("productbuilderpro/group");
            $groupModel->load($groupData['id'])->delete();
            $this->_forward("getgroup");
        }
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
}