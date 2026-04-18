package com.cloudhealth.app;

import android.content.DialogInterface;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity { 

    String websiteURL = "https://cloud-health-khaki.vercel.app/login"; // sets web url 
    private WebView webview; 
    private SwipeRefreshLayout mySwipeRefreshLayout;

    @Override 
    protected void onCreate(Bundle savedInstanceState) { 
        super.onCreate(savedInstanceState); 
        setContentView(R.layout.activity_main); 

        // Webview stuff 
        webview = findViewById(R.id.webView);
        
        // --- CRITICAL SETTINGS FOR MODERN JS & FIREBASE ---
        WebSettings settings = webview.getSettings();
        settings.setJavaScriptEnabled(true); 
        settings.setDomStorageEnabled(true); 
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Required for JS execution, routing logic, and multiple windows/alerts to work
        webview.setWebChromeClient(new WebChromeClient());
        
        // Firebase Auth strictly requires cross-context cookies to maintain its session state
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webview, true);
        // ------------------------------------------------

        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER); 
        webview.loadUrl(websiteURL); 
        webview.setWebViewClient(new WebViewClientDemo()); 

        // Swipe to refresh functionality
        mySwipeRefreshLayout = findViewById(R.id.swipeContainer);
        mySwipeRefreshLayout.setOnRefreshListener(
            new SwipeRefreshLayout.OnRefreshListener() { 
                @Override 
                public void onRefresh() { 
                    webview.reload(); 
                } 
            }
        );
    } 

    private class WebViewClientDemo extends WebViewClient { 
        @Override 
        //Keep webview in app when clicking links 
        public boolean shouldOverrideUrlLoading(WebView view, String url) { 
            view.loadUrl(url); 
            return true; 
        } 
        
        @Override 
        public void onPageFinished(WebView view, String url) { 
            super.onPageFinished(view, url); 
            mySwipeRefreshLayout.setRefreshing(false); 
        }
    }
    
    //set back button functionality
    @Override
    public void onBackPressed() { //if user presses the back button do this 
        if (webview.isFocused() && webview.canGoBack()) { //check if in webview and the user can go back 
            webview.goBack(); //go back in webview 
        } else { //do this if the webview cannot go back any further 
            new AlertDialog.Builder(this) //alert the person knowing they are about to close 
                .setTitle("EXIT") 
                .setMessage("Are you sure? You want to close this app?") 
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() { 
                    @Override 
                    public void onClick(DialogInterface dialog, int which) { 
                        finish(); 
                    } 
                }) 
                .setNegativeButton("No", null) 
                .show(); 
        }
    }
}
