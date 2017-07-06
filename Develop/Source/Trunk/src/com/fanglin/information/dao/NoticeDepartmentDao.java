package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.NoticeDepartmentPO;


public interface NoticeDepartmentDao extends Dao<NoticeDepartmentPO> {
	public List<NoticeDepartmentPO> queryNoticeDepartmentByNoticeId(int noticeId);
	
	public List<NoticeDepartmentPO> queryDepartmentIdNoticeId(int did);
	public void deleteNoticeDepartments(Integer noticeId);
}
