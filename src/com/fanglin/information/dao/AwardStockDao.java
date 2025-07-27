package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.utils.Paging;

public interface AwardStockDao extends Dao<AwardStockPO> {

	public List<AwardStockPO> pageAwardStock(Paging paging, List<Filter> filters, int company);

	public List<AwardStockPO> queryAwardStock(short type, short storeroom, int company);

	public List<AwardStockPO> queryAwardStockByName(String name, int limit, int company);

	public AwardStockPO queryAwardStockByNo(String no, int company);

}
