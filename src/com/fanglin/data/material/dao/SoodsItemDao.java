package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SoodsItemPO;
import com.fanglin.utils.Paging;

public interface SoodsItemDao extends Dao<SoodsItemPO> {

	public List<SoodsItemPO> pageSoodsItem(Paging paging, List<Filter> filters, int company);

	public List<SoodsItemPO> pageSoodsItemByQiid(Paging paging, List<Filter> filters, long qiid, Short status);

	public List<SoodsItemPO> pageSoodsItemBySid(Paging paging, List<Filter> filters, long sid, Short status);

	public List<SoodsItemPO> querySoodsItemByQiid(long qiid);

	public List<SoodsItemPO> querySoodsItemBySid(long sid);

	public int countSoodsItem(long gid, long qiid);

	public int copySoodsItem(long sqiid, long tqiid);

	public int deleteSoodsItem(long sid);

	public int deleteSoodsItemByQiid(long qiid);

}
