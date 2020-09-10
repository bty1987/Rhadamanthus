package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.NoticeDepartmentPO;

public interface NoticeDepartmentDao extends Dao<NoticeDepartmentPO> {

	public List<NoticeDepartmentPO> queryNoticeDepartmentByNid(Long nid);

	public List<NoticeDepartmentPO> queryNoticeDepartmentByDid(Integer did);

	public int deleteNoticeDepartment(Long nid);

}
