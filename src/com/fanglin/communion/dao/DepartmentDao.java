/**
 * Title: DepartmentDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DepartmentDao extends Dao<DepartmentPO> {
	

    public List<DepartmentPO> pageDepartment(Paging paging, List<Filter> filters,int company);
    
    public List<DepartmentPO> pageDepartmentByName(Paging paging, String name, Integer company, int type);
    
    public List<DepartmentPO> queryDepartment(int type,Integer company);

	public DepartmentPO queryDepartmentByNo(String no);

    public List<DepartmentPO> queryDepartmentBytype(int type ,Integer company);
    
}
