package com.fanglin.system.service.impl;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("CompanyService")
@Transactional(readOnly = true)
public class CompanyServiceImpl implements CompanyService{
	
	@Autowired
	private CompanyDao  companyDao;
	
	@Override
	public void pageCompany(Paging paging, List<Filter> filters) {
		List<CompanyPO> companyPOs = companyDao.pageCompany(paging, filters);
		List<CompanyVO> companyVOs = new ArrayList<CompanyVO>();
		
		for(CompanyPO companyPO: companyPOs){
			CompanyVO companyVO = new CompanyVO();
			BeanUtil.copyProperties(companyPO,companyVO);
			companyVOs.add(companyVO);
		}
		paging.setData(companyVOs);	
	}

	@Override
	public List<CompanyVO> queryCompany() {
		
		List<CompanyPO> companyPOs = companyDao.list();
		List<CompanyVO> companyVOs = new ArrayList<CompanyVO>();
		
		for(CompanyPO companyPO: companyPOs){
			CompanyVO companyVO = new CompanyVO();
	
			BeanUtil.copyProperties(companyPO, companyVO);
			
			companyVOs.add(companyVO);
		}

		return companyVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addCompany(CompanyVO companyVO) throws FLException {
		
		CompanyPO companyPOs = companyDao.queryCompanyByNo(companyVO.getNo());
		if(companyPOs!=null){
			throw new FLException(130013 , "公司编号已存在");
		}
		
		CompanyPO companyPO = companyDao.queryCompanyByName(companyVO.getName());
		if (companyPO!=null) {
			throw new FLException(130014 , "公司名称已存在");
		}
	
		companyPO = new CompanyPO();
		BeanUtil.copyProperties(companyVO,companyPO);
		companyDao.save(companyPO);
		return 0;
	}



	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCompany(CompanyVO companyVO) throws FLException {
	
		CompanyPO companyPO = companyDao.queryCompanyById(companyVO.getCid());
		if (companyPO==null) {
			throw new FLException(230014 , "公司已经存在");
		}
		CompanyPO companyPOs = companyDao.queryCompanyByName(companyVO.getName());
		if (companyPOs!=null) {
			throw new FLException(130014 , "公司名称已存在");
		}
		BeanUtil.copyProperties(companyVO,companyPO);
		companyPO.setName(companyVO.getName());
		companyDao.update(companyPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCompanyForStatus(CompanyVO companyVO) throws FLException {
	
		CompanyPO companyPO = companyDao.queryCompanyById(companyVO.getCid());
		if (companyPO==null) {
			throw new FLException(230014 , "公司已经存在");
		}
		BeanUtil.copyProperties(companyVO,companyPO);
		companyPO.setStatus(companyVO.getStatus());
		companyDao.update(companyPO);
		
		return 0;
	}





}
