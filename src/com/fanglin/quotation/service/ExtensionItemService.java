package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.ExtensionItemVO;
import com.fanglin.quotation.vo.ExtensionVO;


public interface ExtensionItemService {
	
	public List<ExtensionItemVO> queryExtensionItemByEid(ExtensionItemVO extensionItemVO);
	
	public List<ExtensionItemVO> queryExtensionItemByEids(List<Long> extensionItemIDs);
	
	public int updateExtensionItem(ExtensionItemVO extensionItemVO,ExtensionVO extensionVO)throws FLException;
	
	public void deleteExtensionItem(ExtensionItemVO extensionItemVO,ExtensionVO extensionVO)throws FLException;
	
}
