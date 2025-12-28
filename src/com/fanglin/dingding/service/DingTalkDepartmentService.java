/**
 * @File Name		: DepartmentService.java
 * @Package   	: com.fanglin.dingding.service
 * @Version		: 1.0
 * @Date			: 2016-12-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.bean.Department;

/**
 * 钉钉部门服务接口
 */
public interface DingTalkDepartmentService {

	/**
	 * 查询部门列表
	 * @param company 公司ID
	 * @return 部门列表
	 * @throws FLException 异常
	 */
	public List<Department> queryDepartment(Integer company) throws FLException;

}
