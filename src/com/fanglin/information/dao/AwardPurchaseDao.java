package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.AwardPurchasePO;
import com.fanglin.utils.Paging;

public interface AwardPurchaseDao extends Dao<AwardPurchasePO> {

	public List<AwardPurchasePO> pageAwardPurchase(Paging paging, List<Filter> filters, int company);

}
