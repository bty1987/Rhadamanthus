package com.fanglin.sales.service.impl;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.sales.service.SalesPurchaseService;

@Service("salesPurchaseService")
@Transactional(readOnly=true)
public class SalesPurchaseServiceImpl implements SalesPurchaseService{
	
}
