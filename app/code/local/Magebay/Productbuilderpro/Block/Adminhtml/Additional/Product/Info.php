<?php
class Magebay_Productbuilderpro_Block_Adminhtml_Additional_Product_Info extends Mage_Core_Block_Abstract
{
    protected function _toHtml()
    {
        $item = $this->getParentBlock()->getItem();
        $additionalOptions = serialize($item->getProductOptionByCode("additional_options"));
        if($additionalOptions) {
            $customizeInfo = Mage::helper("productbuilderpro")->getCustomizeInfo($additionalOptions);
            if($customizeInfo) {
                $html = "<div>";
                    $html .= '<dt><span style="font-weight: bold">' . Mage::helper("productbuilderpro")->__("Customize Info") . '</span></dt>';
                    $html .= '<dl class="item-options pdp_cart_item">';
                    foreach ($customizeInfo['selected_layer'] as $layer) {
                        $html .= '<dt>' . $layer['root_title'] . '<dt>';
                        $html .= '<dd>' . $layer['title'] . '<dd>';
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