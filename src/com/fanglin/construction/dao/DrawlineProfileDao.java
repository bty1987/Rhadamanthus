package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.po.DrawlineProfilePO;
import com.fanglin.utils.Paging;

public interface DrawlineProfileDao extends Dao<DrawlineProfilePO> {

	public List<DrawlineProfilePO> pageDrawlineProfile(Paging paging, List<Filter> filters, int company);

	public List<DrawlineProfilePO> queryDrawlineProfileByDlid(long dlid, Short type);

	public List<DrawlineProfilePO> queryDrawlineProfileByOrderId(String orderId, Short type);

}
