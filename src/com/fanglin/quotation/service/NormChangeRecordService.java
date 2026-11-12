package com.fanglin.quotation.service;

import com.fanglin.quotation.vo.NormChangeRecordVO;
import com.fanglin.utils.Paging;

public interface NormChangeRecordService {

	public void pageNormChangeRecord(Paging paging, NormChangeRecordVO normChangeRecordVO);

}
