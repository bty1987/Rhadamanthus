/**
 * Title: DepartmentDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.department.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.utils.Paging;

public interface DepartmentDao extends Dao<DepartmentPO> {

    public List<DepartmentPO> pageDepartment(Paging paging, List<FilterVO> filters);
    
//    public List<DepartmentPO> pageDepartmentForSubset(Paging paging, List<FilterVO> filters);

    public List<DepartmentPO> queryDepartment(String type, Integer company);

    public List<String> queryDepartmentForChildren(String fatherDeptId);
}
