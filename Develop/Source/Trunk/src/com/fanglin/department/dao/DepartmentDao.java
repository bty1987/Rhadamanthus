/**
 * Title: DepartmentDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.department.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.utils.Paging;

public interface DepartmentDao extends Dao<DepartmentPO> {

    public List<DepartmentPO> pageDepartment(Paging paging, List<Filter> filters);
    
    public List<DepartmentPO> pageDepartmentByName(Paging paging, String name, Integer company, String type);
    
    public List<DepartmentPO> queryDepartment(String type, Integer company);

    public List<String> queryDepartmentForChildren(String fatherDeptId);
}
