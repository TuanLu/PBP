<?php
class Magebay_Productbuilderpro_DirectivesController extends Mage_Core_Controller_Front_Action
{
    public function pbpGroupAction()
    {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-group.phtml")->toHtml();
    }
    public function pbpOptionCollectionAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-option-collection.phtml")->toHtml();
    }
    public function pbpOptionDetailsAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-option-details.phtml")->toHtml();
    }
    // Frontend
    public function pbpLayerCollectionAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-layer-collection.phtml")->toHtml();
    }
    public function pbpLayerDetailsAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-layer-details.phtml")->toHtml();
    }
    public function pbpMediaAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/pbp-media.phtml")->toHtml();
    }
    public function selectedLayerAction() {
        echo $this->getLayout()->createBlock("core/template")->setTemplate("productbuilderpro/directives/selected-layer.phtml")->toHtml();
    }
}