package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QeasurePO;
import com.fanglin.utils.Paging;

public interface QeasureDao extends Dao<QeasurePO> {

	public List<QeasurePO> pageQeasure(Paging paging, List<Filter> filters, int company);

	public QeasurePO queryQeasureByOrderId(String orderId);

}
