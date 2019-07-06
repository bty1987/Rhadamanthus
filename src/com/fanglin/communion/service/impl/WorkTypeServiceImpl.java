/**
 * @File Name		: WorkTypeServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.WorkTypeDao;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.communion.service.WorkTypeService;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.utils.BeanUtil;

@Service("workTypeService")
@Transactional(readOnly = true)
public class WorkTypeServiceImpl implements WorkTypeService {

	@Autowired
	private WorkTypeDao workTypeDao;

	@Override
	public List<WorkTypeVO> queryWorkType() {

		List<WorkTypePO> workTypePOs = workTypeDao.list();
		List<WorkTypeVO> workTypeVOs = new ArrayList<WorkTypeVO>();

		for (WorkTypePO workTypePO : workTypePOs) {
			WorkTypeVO workTypeVO = new WorkTypeVO();
			BeanUtil.copyProperties(workTypePO, workTypeVO);

			workTypeVOs.add(workTypeVO);
		}

		return workTypeVOs;
	}

	public WorkTypeDao getWorkTypeDao() {
		return workTypeDao;
	}

	public void setWorkTypeDao(WorkTypeDao workTypeDao) {
		this.workTypeDao = workTypeDao;
	}

}
