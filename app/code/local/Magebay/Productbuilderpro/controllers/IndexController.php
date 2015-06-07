<?php
class Magebay_Productbuilderpro_IndexController extends Mage_Core_Controller_Front_Action
{
    public function testAction() {
        echo "Get Layers<pre>";
        $layerModel = Mage::getModel("productbuilderpro/layer");
        //$layers = $layerModel->getAllLayers();
        //$layers = $layerModel->getLayerByGroupId(2);
        Zend_Debug::dump(array_values($layerModel->getParentOptions()));
    }
    public function indexAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/index.phtml")->toHtml();
    }
    public function editOptionAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/edit_option.phtml")->toHtml();
    }
    public function addGroupAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/add_group.phtml")->toHtml();
    }
    public function addLayerAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/templates/add_layer.phtml")->toHtml();
    }
}