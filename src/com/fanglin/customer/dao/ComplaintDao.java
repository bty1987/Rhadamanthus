package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.ComplaintPO;

public interface ComplaintDao extends Dao<ComplaintPO> {

	public List<ComplaintPO> queryComplaint(long cid);

}
