package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerFunctionDao;
import com.fanglin.customer.po.CustomerFunctionPO;
import com.fanglin.customer.service.CustomerFunctionService;
import com.fanglin.customer.vo.CustomerFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerFunctionService")
@Transactional(readOnly = true)
public class CustomerFunctionServiceImpl implements CustomerFunctionService {

	@Autowired
	private CustomerFunctionDao customerFunctionDao;

	@Override
	public List<CustomerFunctionVO> pageCustomerFunction(Paging paging, List<Filter> filters) {

		List<CustomerFunctionPO> customerFunctionPOs = customerFunctionDao.pageCustomerFunction(paging, filters);
		List<CustomerFunctionVO> customerFunctionVOs = new ArrayList<CustomerFunctionVO>();

		for (CustomerFunctionPO customerFunctionPO : customerFunctionPOs) {

			CustomerFunctionVO customerFunctionVO = new CustomerFunctionVO();
			BeanUtil.copyPropertie(customerFunctionPO, customerFunctionVO);

			customerFunctionVOs.add(customerFunctionVO);
		}

		return customerFunctionVOs;
	}

	@Override
	public List<CustomerFunctionVO> queryCustomerFunction(CustomerFunctionVO customerFunctionVO) {

		List<CustomerFunctionPO> customerFunctionPOs = customerFunctionDao.queryCustomerFunction(customerFunctionVO.getType());
		List<CustomerFunctionVO> customerFunctionVOs = new ArrayList<CustomerFunctionVO>();

		for (CustomerFunctionPO customerFunctionPO : customerFunctionPOs) {

			customerFunctionVO = new CustomerFunctionVO();
			BeanUtil.copyPropertie(customerFunctionPO, customerFunctionVO);

			customerFunctionVOs.add(customerFunctionVO);

		}

		return customerFunctionVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCustomerFunction(CustomerFunctionVO customerFunctionVO) throws FLException {

		if (customerFunctionDao.queryCustomerFunctionByName(customerFunctionVO.getName()).size() > 0) {
			throw new FLException(330119, "客户功能已存在");
		}

		CustomerFunctionPO customerFunctionPO = new CustomerFunctionPO();

		BeanUtil.copyPropertie(customerFunctionVO, customerFunctionPO);

		customerFunctionDao.save(customerFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCustomerFunction(CustomerFunctionVO customerFunctionVO) throws FLException {

		CustomerFunctionPO customerFunctionPO = customerFunctionDao.get(customerFunctionVO.getCfid());

		if (customerFunctionPO == null) {
			throw new FLException(330121, "客户功能不存在");
		}

		for (CustomerFunctionPO namePO : customerFunctionDao.queryCustomerFunctionByName(customerFunctionVO.getName())) {
			if (namePO.getCfid() != customerFunctionVO.getCfid().longValue()) {
				throw new FLException(330119, "客户功能已存在");
			}
		}

		BeanUtil.copyPropertie(customerFunctionVO, customerFunctionPO, Arrays.asList("cfid"));

		customerFunctionDao.update(customerFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCustomerFunction(CustomerFunctionVO customerFunctionVO) throws FLException {

		if (customerFunctionDao.countCustomerFunctionRightByCfid(customerFunctionVO.getCfid()) > 0) {
			throw new FLException(330120, "客户功能已被引用,不可删除");
		}

		customerFunctionDao.deleteById(customerFunctionVO.getCfid());

		return 0;
	}

}
