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
}