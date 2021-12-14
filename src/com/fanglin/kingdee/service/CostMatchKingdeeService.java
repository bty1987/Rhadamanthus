/**
 * @File Name		: CostMatchKingdeeService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.po.SalaryPO;

public interface CostMatchKingdeeService {

	public void payWages(SalaryPO salaryPO) throws FLException;

}
