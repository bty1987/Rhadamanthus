package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.utils.Paging;

public interface ExtensionService {

	public void pageExtensionByOrderId(Paging paging, List<Filter> filters, ExtensionVO extensionVO);

	public List<ExtensionVO> queryExtensionByOrderId(ExtensionVO extensionVO);

	public ExtensionVO queryExtensionByEid(ExtensionVO extensionVO) throws FLException;

	public void addExtension(ExtensionVO extensionVO) throws FLException;

	public void updateExtension(ExtensionVO extensionVO) throws FLException;

	public void updateExtensionForAdvance(ExtensionVO extensionVO) throws FLException;

	public void deleteExtension(ExtensionVO extensionVO) throws FLException;

}
