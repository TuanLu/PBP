<?php
class Magebay_Productbuilderpro_Block_Adminhtml_Additional_Product_Info extends Mage_Core_Block_Abstract
{
    protected function _toHtml()
    {
        $item = $this->getParentBlock()->getItem();
        //Zend_Debug::dump($item->getData());
        $additionalOptions = serialize($item->getProductOptionByCode("additional_options"));
        if($additionalOptions) {
            $customizeInfo = Mage::helper("productbuilderpro")->getCustomizeInfo($additionalOptions);
            if($customizeInfo) {
                $html = "<div class='view-customize-design' id='customize-". $item->getData("item_id") ."'>";
                    $html .= '<dt><span style="font-weight: bold">' . Mage::helper("productbuilderpro")->__("Customize Information:") . '</span></dt>';
                    $html .= '<dl class="item-options pdp_cart_item">';
                    foreach ($customizeInfo['selected_layer'] as $layer) {
                        $price = Mage::helper('core')->currency($layer['price'], true, false);
                        $html .= '<dt>' . $layer['root_title'] . '<dt>';
                        $html .= '<dd>' . $layer['title'] . ': <strong class="price">' . $price . '</strong><dd>';
                    }
                    $html .= "<dt>". Mage::helper("productbuilderpro")->__("Design Preview") ."</dt>";
                    $html .= "<dd><img src='". $customizeInfo['thumbnail_image'] ."' width='200px'/></dd>";
                    $html .= '</dl>';
                $html .= "</div>";
                return $html;
            }
        }
    }
}