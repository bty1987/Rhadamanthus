/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.fanglin.core.interceptor;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.StrutsStatics;
import org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.ActionProxy;
import com.opensymphony.xwork2.LocaleProvider;
import com.opensymphony.xwork2.TextProvider;
import com.opensymphony.xwork2.TextProviderFactory;
import com.opensymphony.xwork2.ValidationAware;
import com.opensymphony.xwork2.inject.Container;
import com.opensymphony.xwork2.inject.Inject;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.PatternMatcher;
import com.opensymphony.xwork2.util.TextParseUtil;
import com.opensymphony.xwork2.util.logging.Logger;
import com.opensymphony.xwork2.util.logging.LoggerFactory;

public class UploadInterceptor extends AbstractInterceptor{

    private static final long serialVersionUID = -4764627478894962478L;

    protected static final Logger LOG = LoggerFactory.getLogger(UploadInterceptor.class);
    
    private int errorFlag = 0;
    
    private Integer errorCode;
    
    private String errorMsg;
    
	protected Long maximumSize;
    
	protected Set<String> allowedTypesSet = Collections.emptySet();
    
	protected Set<String> allowedExtensionsSet = Collections.emptySet();

    @SuppressWarnings("rawtypes")
	private PatternMatcher matcher;
    
    private Container container;
    
    @Override
	public String intercept(ActionInvocation invocation) throws Exception {
        ActionContext ac = invocation.getInvocationContext();

        HttpServletRequest request = (HttpServletRequest) ac.get(StrutsStatics.HTTP_REQUEST);

        if(!(request instanceof MultiPartRequestWrapper)){
            if(LOG.isDebugEnabled()){
                ActionProxy proxy = invocation.getProxy();
                LOG.debug(getTextMessage("struts.messages.bypass.request", new String[]{proxy.getNamespace(), proxy.getActionName()}));
            }

            return invocation.invoke();
        }

        ValidationAware validation = null;

        Object action = invocation.getAction();

        if(action instanceof ValidationAware){
            validation = (ValidationAware) action;
        }

        MultiPartRequestWrapper multiWrapper = (MultiPartRequestWrapper) request;

        if(multiWrapper.hasErrors()){
            for(String error : multiWrapper.getErrors()){
                if(validation != null){
                    validation.addActionError(error);
                }
            }
        }

        // bind allowed Files
        Enumeration<String> fileParameterNames = multiWrapper.getFileParameterNames();
        while (fileParameterNames != null && fileParameterNames.hasMoreElements()){
            // get the value of this input tag
            String inputName = (String) fileParameterNames.nextElement();
            
            // get the content type
            String[] contentType = multiWrapper.getContentTypes(inputName);

            if(isNonEmpty(contentType)){
                // get the name of the file from the input tag
                String[] fileName = multiWrapper.getFileNames(inputName);

                if(isNonEmpty(fileName)){
                    // get a File object for the uploaded File
                    File[] files = multiWrapper.getFiles(inputName);
                    if(files != null && files.length > 0){
                    	
                        List<File> acceptedFiles = new ArrayList<File>(files.length);
                        List<String> acceptedContentTypes = new ArrayList<String>(files.length);
                        List<String> acceptedFileNames = new ArrayList<String>(files.length);
                        
                        String contentTypeName = inputName + "contentType";
                        String fileNameName = inputName + "fileName";

                        for(int index = 0; index < files.length; index++){
                            if(acceptFile(action, files[index], fileName[index], contentType[index], inputName, validation)){
                                acceptedFiles.add(files[index]);
                                acceptedContentTypes.add(contentType[index]);
                                acceptedFileNames.add(fileName[index]);
                            }
                        }

                        if(!acceptedFiles.isEmpty()){
                            Map<String, Object> params = ac.getParameters();
                            
                            params.put(inputName, acceptedFiles.toArray(new File[acceptedFiles.size()]));
                            params.put(contentTypeName, acceptedContentTypes.toArray(new String[acceptedContentTypes.size()]));
                            params.put(fileNameName, acceptedFileNames.toArray(new String[acceptedFileNames.size()]));
                        }
                    }
                } else {
                    if(LOG.isWarnEnabled()){
                        LOG.warn(getTextMessage(action, "struts.messages.invalid.file", new String[]{inputName}));
                    }
                   errorCode = -5;
                   errorMsg= "无效的文件";
                }
            } else {

                errorCode = -6;
                errorMsg="无效的文件类型";
                if(LOG.isWarnEnabled()){
                    LOG.warn(getTextMessage(action, "struts.messages.invalid.content.type", new String[]{inputName}));
                }
            }
        }
        
        Map<String, Object> params = ac.getParameters();
        params.put("errorCode", errorCode);
        params.put("errorMsg",  errorMsg);

        return invocation.invoke();
    }

    protected boolean acceptFile(Object action, File file, String filename, String contentType, String inputName, ValidationAware validation){
        boolean fileIsAcceptable = false;

        // If it's null the upload failed
        if(file == null){
            String errMsg = getTextMessage(action, "struts.messages.error.uploading", new String[]{inputName});
            if(validation != null){
                validation.addFieldError(inputName, errMsg);
            }

            if(LOG.isWarnEnabled()){
                LOG.warn(errMsg);
            }
            
            errorCode = -1;
            errorMsg = "上传出错";
            
        } else if(maximumSize != null && maximumSize < file.length()){
            String errMsg = getTextMessage(action, "struts.messages.error.file.too.large", new String[]{inputName, filename, file.getName(), "" + file.length()});
            if(validation != null){
                validation.addFieldError(inputName, errMsg);
            }

            if(LOG.isWarnEnabled()){
                LOG.warn(errMsg);
            }
            errorCode=-2;
            errorMsg= "当前文件大小"+file.length()+"超过"+maximumSize+"个字节";
        } else if((!allowedTypesSet.isEmpty()) && (!containsItem(allowedTypesSet, contentType))){
            String errMsg = getTextMessage(action, "struts.messages.error.content.type.not.allowed", new String[]{inputName, filename, file.getName(), contentType});
            if(validation != null){
                validation.addFieldError(inputName, errMsg);
            }

            if(LOG.isWarnEnabled()){
                LOG.warn(errMsg);
            }
            errorCode=-3;
            String tem = new String();
            for(String e : allowedTypesSet){
				tem+=(e.trim()+",");
			}
            tem = tem.substring(0, tem.length()-1);
            errorMsg="不支持"+contentType+"文件类型,目前只支持"+tem;
            
        } else if((!allowedExtensionsSet.isEmpty()) && (!hasAllowedExtension(allowedExtensionsSet, filename))){
            String errMsg = getTextMessage(action, "struts.messages.error.file.extension.not.allowed", new String[]{inputName, filename, file.getName(), contentType});
            if(validation != null){
                validation.addFieldError(inputName, errMsg);
            }

            if(LOG.isWarnEnabled()){
                LOG.warn(errMsg);
            }
            
            errorCode=-4;
            String tem = new String();
            for(String e : allowedExtensionsSet){
				tem+=(e+",");
			}
            tem = tem.substring(0, tem.length()-1);
            errorMsg="不支持该文件文件扩展名，目前只支持"+tem;
            
        } else {
            fileIsAcceptable = true;
            
            errorCode=0;
            errorMsg="";
        }
        if(!fileIsAcceptable){
        	errorFlag = 1;
        }
        return fileIsAcceptable;
    }

    private boolean hasAllowedExtension(Collection<String> extensionCollection, String filename){
        if(filename == null){
            return false;
        }

        String lowercaseFilename = filename.toLowerCase();
        for(String extension : extensionCollection){
            if(lowercaseFilename.endsWith(extension)){
                return true;
            }
        }

        return false;
    }

    private boolean containsItem(Collection<String> itemCollection, String item){
        for(String pattern : itemCollection){
            if(matchesWildcard(pattern, item)){
                return true;
            }
        }
        return false;
    }

    @SuppressWarnings("unchecked")
	private boolean matchesWildcard(String pattern, String text){
        Object o = matcher.compilePattern(pattern);
        return matcher.match(new HashMap<String, String>(), text, o);
    }

    private boolean isNonEmpty(Object[] objArray){
        boolean result = false;
        for(int index = 0; index < objArray.length && !result; index++){
            if(objArray[index] != null){
                result = true;
            }
        }
        return result;
    }

    protected String getTextMessage(String messageKey, String[] args){
        return getTextMessage(this, messageKey, args);
    }
    
    protected String getTextMessage(Object action, String messageKey, String[] args){
        if(action instanceof TextProvider){
            return ((TextProvider) action).getText(messageKey, args);
        }
        return getTextProvider(action).getText(messageKey, args);
    }

    private TextProvider getTextProvider(Object action){
        TextProviderFactory tpf = new TextProviderFactory();
        if(container != null){
            container.inject(tpf);
        }
        LocaleProvider localeProvider = getLocaleProvider(action);
        return tpf.createInstance(action.getClass(), localeProvider);
    }

    private LocaleProvider getLocaleProvider(Object action){
        LocaleProvider localeProvider;
        if(action instanceof LocaleProvider){
            localeProvider = (LocaleProvider) action;
        } else {
            localeProvider = container.getInstance(LocaleProvider.class);
        }
        return localeProvider;
    }
    
	@Inject
	@SuppressWarnings("rawtypes")
    public void setMatcher(PatternMatcher matcher){
        this.matcher = matcher;
    }

    @Inject
    public void setContainer(Container container){
        this.container = container;
    }

    public void setAllowedExtensions(String allowedExtensions){
        allowedExtensionsSet = TextParseUtil.commaDelimitedStringToSet(allowedExtensions);
    }

    public void setAllowedTypes(String allowedTypes){
        allowedTypesSet = TextParseUtil.commaDelimitedStringToSet(allowedTypes);
    }

    public void setMaximumSize(Long maximumSize){
        this.maximumSize = maximumSize;
    }

	public int getErrorFlag(){
		return errorFlag;
	}

	public void setErrorFlag(int errorFlag){
		this.errorFlag = errorFlag;
	}

	public Integer getErrorCode(){
		return errorCode;
	}

	public void setErrorCode(Integer errorCode){
		this.errorCode = errorCode;
	}

	public String getErrorMsg(){
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg){
		this.errorMsg = errorMsg;
	}

}
