package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ReceiptTypeItemVO;

public interface ReceiptTypeItemService {

	public List<ReceiptTypeItemVO> queryReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem);

	public void addReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException;

	public void deleteReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException;

}
