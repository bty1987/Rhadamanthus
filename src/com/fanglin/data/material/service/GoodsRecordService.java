package com.fanglin.data.material.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.vo.GoodsRecordVO;
import com.fanglin.utils.Paging;

public interface GoodsRecordService {

	public void pageGoodsRecord(Paging paging, List<Filter> filters, GoodsRecordVO goodsRecord);

}
