/**
 * @File Name		: DesignerPreBalanceSalaryService.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.DesignerPreBalanceSalaryDao;
import com.fanglin.salary.po.DesignerPreBalanceSalaryPO;
import com.fanglin.salary.service.DesignerPreBalanceSalaryService;
import com.fanglin.salary.vo.DesignerPreBalanceSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("designerPreBalanceSalaryService")
@Transactional(rollbackFor=Exception.class)
public class DesignerPreBalanceSalaryServiceImpl implements DesignerPreBalanceSalaryService {
	
	@Autowired
	private DesignerPreBalanceSalaryDao designerPreBalanceSalaryDao;

	@Override
	public void pageDesignerPreBalanceSalary(Paging paging, List<FilterVO> filters) {
		
		List<DesignerPreBalanceSalaryPO> designerPreBalanceSalaryPOs = designerPreBalanceSalaryDao.pageDesignerPreBalanceSalary(paging, filters);
		List<DesignerPreBalanceSalaryVO> designerPreBalanceSalaryVOs = new ArrayList<DesignerPreBalanceSalaryVO>();
		
		for(DesignerPreBalanceSalaryPO designerPreBalanceSalaryPO: designerPreBalanceSalaryPOs){
			DesignerPreBalanceSalaryVO designerPreBalanceSalaryVO = new DesignerPreBalanceSalaryVO();
			BeanUtil.copyProperties(designerPreBalanceSalaryPO, designerPreBalanceSalaryVO);
			
			designerPreBalanceSalaryVOs.add(designerPreBalanceSalaryVO);
		}

		paging.setData(designerPreBalanceSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addDesignerPreBalanceSalary(DesignerPreBalanceSalaryVO designerPreBalanceSalaryVO) {
		
		DesignerPreBalanceSalaryPO designerPreBalanceSalaryPO = new DesignerPreBalanceSalaryPO();
		BeanUtil.copyProperties(designerPreBalanceSalaryVO, designerPreBalanceSalaryPO);
		
		designerPreBalanceSalaryPO.setCreateTime(DateUtil.current(DesignerPreBalanceSalaryPO.CURRENT_TIME_FORMAT_STR));
		
		designerPreBalanceSalaryDao.saveOrUpdate(designerPreBalanceSalaryPO);
	}

}
