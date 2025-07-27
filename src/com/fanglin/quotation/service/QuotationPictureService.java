package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationPictureVO;

public interface QuotationPictureService {

	public List<QuotationPictureVO> queryQuotationPicture(QuotationPictureVO quotationPictureVO);

	public int addQuotationPicture(List<QuotationPictureVO> quotationPictureVOs, String userId) throws FLException;

	public int deleteQuotationPicture(QuotationPictureVO quotationPictureVO);
}
