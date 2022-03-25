package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.ReceiptTypeItemVO;
import com.fanglin.core.interceptor.FLException;

public interface ReceiptTypeItemService {

	public List<ReceiptTypeItemVO> queryReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem);

	public void addReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException;

	public void deleteReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException;

}
