/**
 * @File Name		: ReceiptTypeService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2016-5-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ReceiptTypeVO;
import com.fanglin.utils.Paging;

public interface ReceiptTypeService {
	
	public void pageReceiptType(Paging paging, List<Filter> filters);
	
	public List<ReceiptTypeVO> queryReceiptType();
	
	public List<ReceiptTypeVO> queryReceiptTypeByType(ReceiptTypeVO receiptTypeVO);
	
	public int addReceiptType(ReceiptTypeVO receiptTypeVO) throws FLException;
	
}
