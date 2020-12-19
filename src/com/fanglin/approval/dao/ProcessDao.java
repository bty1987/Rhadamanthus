
package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ProcessPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ProcessDao extends Dao<ProcessPO> {

	public List<ProcessPO> pageProcess(Paging paging, List<Filter> filters);

	public List<ProcessPO> queryProcess();

	public ProcessPO queryProcess(String no);

	public int deleteProcessItem(long pid);
	
}
