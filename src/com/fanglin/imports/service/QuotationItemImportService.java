package com.fanglin.imports.service;

import java.util.List;

public interface QuotationItemImportService {
	
	public void importQuotationItem(List<List<String>> excels, String userId);

}
