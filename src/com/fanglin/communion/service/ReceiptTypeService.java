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
package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ReceiptTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ReceiptTypeService {
	
	public void pageReceiptType(Paging paging, List<Filter> filters, int company);
	
	public List<ReceiptTypeVO> queryReceiptType(int company);
	
	public List<ReceiptTypeVO> queryReceiptTypeByType(ReceiptTypeVO receiptTypeVO,int company);
	
	public int addReceiptType(ReceiptTypeVO receiptTypeVO,int company) throws FLException;
	
	public int updateReceiptType(ReceiptTypeVO receiptTypeVO, int company ) throws FLException;
	
	public  void  updateReceiptTypeForStatus(ReceiptTypeVO receiptTypeVO)throws FLException;
	
}
