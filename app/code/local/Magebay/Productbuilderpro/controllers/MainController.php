<?php
class Magebay_Productbuilderpro_MainController extends Mage_Core_Controller_Front_Action
{
    public function saveGroupAction() {
        $response = array(
            'status' => 'error',
            'message' => 'Can not save group. Something went worng!'
        );
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
        }
    }
    public function getGroupAction() {
        $groupCollection = Mage::getModel("productbuilderpro/group")->getCollection();
        if($groupCollection->count()) {
            $groups = [];
            foreach($groupCollection as $group) {
                $groups[] = $group->getData();
            }
            echo json_encode($groups);
        }
        
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
                        $name = time() . '-image.' . end($filenameTemp);
                        $size = $upload["size"];
                        $type = $upload["type"]; // could be bogus!!! Users and browsers lie!!!
                        $tmp  = $upload["tmp_name"];
                        $result = move_uploaded_file( $tmp, $baseDir .$name);
                        if ($result) {
                            $response = array(
                                'status' => 'success',
                                'message' => 'Image had uploaded successfully!',
                                'data' => 'Image List',
                                'filename' => $name
                            );
                        }
                    } else if ($upload['error'] === UPLOAD_ERR_INI_SIZE) {
                        $response['status'] = 'error';
                        $response['message'] = 'The uploaded file exceeds the upload_max_filesize. Please check your server PHP settings!';
                        $this->getResponse()->setBody(json_encode($response))->sendResponse();
                        exit();
                    }
					$this->getResponse()->setBody(json_encode($response));
				}
			}
		}
    }
}