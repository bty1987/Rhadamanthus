/**
 * @File Name		: DesignerDeductSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-11-7
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
import com.fanglin.salary.dao.DesignerDeductSalaryDao;
import com.fanglin.salary.po.DesignerDeductSalaryPO;
import com.fanglin.salary.service.DesignerDeductSalaryService;
import com.fanglin.salary.vo.DesignerDeductSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("designerDeductSalaryService")
@Transactional(readOnly=true)
public class DesignerDeductSalaryServiceImpl implements DesignerDeductSalaryService {
	
	@Autowired
	private DesignerDeductSalaryDao designerDeductSalaryDao;

	@Override
	public void pageDesignerDeductSalary(Paging paging, List<FilterVO> filters) {
		
		List<DesignerDeductSalaryPO> designerDeductSalaryPOs = designerDeductSalaryDao.pageDesignerDeductSalary(paging, filters);
		List<DesignerDeductSalaryVO> designerDeductSalaryVOs = new ArrayList<DesignerDeductSalaryVO>();
		
		for(DesignerDeductSalaryPO designerDeductSalaryPO: designerDeductSalaryPOs){
			DesignerDeductSalaryVO designerDeductSalaryVO = new DesignerDeductSalaryVO();
			BeanUtil.copyProperties(designerDeductSalaryPO, designerDeductSalaryVO);
			designerDeductSalaryVOs.add(designerDeductSalaryVO);
		}
		
		paging.setData(designerDeductSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addDesignerDeductSalary(	DesignerDeductSalaryVO designerDeductSalaryVO) {
		
		DesignerDeductSalaryPO designerDeductSalaryPO = new DesignerDeductSalaryPO();
		BeanUtil.copyProperties(designerDeductSalaryVO, designerDeductSalaryPO);
		designerDeductSalaryDao.saveOrUpdate(designerDeductSalaryPO);
	}

}
