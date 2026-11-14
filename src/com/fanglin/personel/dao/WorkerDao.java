package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface WorkerDao extends Dao<UserPO> {

	public List<UserPO> pageWorker(Paging paging, List<Filter> filters, int company);

	public int countWorkerByCompany(int company);

}
